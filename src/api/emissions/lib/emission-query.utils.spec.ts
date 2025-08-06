import { fetchQuarterlyEndLogs } from './emission-query.utils';
import type { QuarterEndLog } from './types';
import type { PrismaService } from 'prisma/prisma.service';

describe('fetchQuarterlyEndLogs', () => {
  let mockPrisma: {
    $queryRaw: jest.Mock<
      Promise<QuarterEndLog[]>,
      [TemplateStringsArray, number[]]
    >;
  };

  beforeEach(() => {
    mockPrisma = {
      $queryRaw: jest.fn<
        Promise<QuarterEndLog[]>,
        [TemplateStringsArray, number[]]
      >(),
    };
  });

  it('should call prisma.$queryRaw with the correct SQL and parameters and return the result', async () => {
    // Arrange
    const imos = [101, 202, 303];
    const fakeResult: QuarterEndLog[] = [
      {
        vessel_id: 101,
        quarter: '2025-Q2',
        toutc: new Date('2025-06-30T23:59:59Z'),
        aerco2t2w: 1234.56,
      },
      {
        vessel_id: 202,
        quarter: '2025-Q2',
        toutc: new Date('2025-06-30T23:59:59Z'),
        aerco2t2w: 7890.12,
      },
    ];
    mockPrisma.$queryRaw.mockResolvedValue(fakeResult);

    // Act
    const result = await fetchQuarterlyEndLogs(
      // cast to PrismaService so TS is happy
      mockPrisma as unknown as PrismaService,
      imos,
    );

    // Assert that it was called exactly once
    expect(mockPrisma.$queryRaw).toHaveBeenCalledTimes(1);

    // Unpack the tag args: [templateStrings, ...values]
    const [templateStrings, values] = mockPrisma.$queryRaw.mock.calls[0];

    // Reconstruct the SQL
    const sql = templateStrings.join('');

    // Check the core clauses
    expect(sql).toContain('WITH quarterly_logs AS');
    expect(sql).toContain('FROM "EmissionLog"');

    // And that our IMOs array is passed as the second argument
    expect(values).toEqual(imos);

    // Finally, the return value
    expect(result).toEqual(fakeResult);
  });

  it('should handle empty imos array and return empty array', async () => {
    // Arrange
    const imos: number[] = [];
    mockPrisma.$queryRaw.mockResolvedValue([]);

    // Act
    const result = await fetchQuarterlyEndLogs(
      mockPrisma as unknown as PrismaService,
      imos,
    );

    // It still gets called with a tagged template
    const [templateStrings, values] = mockPrisma.$queryRaw.mock.calls[0];
    expect(Array.isArray(templateStrings)).toBe(true);
    expect(values).toEqual([]); // empty IMOs

    expect(result).toEqual([]); // empty result
  });

  it('should propagate errors from prisma.$queryRaw', async () => {
    // Arrange
    const imos = [1];
    const error = new Error('Database down');
    mockPrisma.$queryRaw.mockRejectedValue(error);

    // Act & Assert
    await expect(
      fetchQuarterlyEndLogs(mockPrisma as unknown as PrismaService, imos),
    ).rejects.toThrow('Database down');
  });
});
