import { Controller, Get, UseInterceptors, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { EmissionService } from './emission.service';

@ApiTags('emissions')
@Controller('emissions')
@UseInterceptors(CacheInterceptor)
export class EmissionController {
  constructor(private readonly svc: EmissionService) {}

  @Get('chart-data')
  @CacheTTL(300)
  @ApiResponse({ status: 200, description: 'Quarterly deviation chart data' })
  @ApiResponse({ status: 404, description: 'Data not found' })
  async getChartData(
    @Query('vesselIds') vesselIds?: string,
    @Query('limit') limit: number = 10,
  ) {
    const selectedIds = vesselIds
      ? vesselIds.split(',').map((id) => parseInt(id.trim()))
      : undefined;

    return this.svc.getChartData({
      vesselIds: selectedIds,
      maxVessels: limit,
    });
  }
}
