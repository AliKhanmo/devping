import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/common/types';
import { CreateMonitorDto, UpdateMonitorDto } from './dto/monitor.dto';
import { Monitor } from './monitor.schema';
import { MonitorsService } from './monitor.service';

@ApiBearerAuth()
@ApiTags('Monitors')
@UseGuards(AuthGuard)
@Controller('api/monitors')
export class MonitorsController {
    constructor(private readonly monitorsService: MonitorsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all Monitors of the loggedin user(using token)' })
    @ApiResponse({ status: 200, description: 'List of monitors', type: [Monitor] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findAll(@Req() request: RequestWithUser): Promise<Monitor[]> {
        if (!request.user?.userId) {
            throw new UnauthorizedException('User ID is missing');
        }
        return this.monitorsService.findAllByUser(request.user.userId);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new monitor' })
    @ApiBody({ type: CreateMonitorDto })
    @ApiResponse({ status: 201, description: 'Monitor created', type: Monitor })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(@Req() req: RequestWithUser, @Body() dto: CreateMonitorDto) {
        if (!req.user?.userId) {
            throw new UnauthorizedException('User ID is missing');
        }
        return this.monitorsService.create(req.user.userId, dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a monitor' })
    @ApiBody({ type: UpdateMonitorDto })
    @ApiResponse({ status: 200, description: 'Monitor updated', type: Monitor })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Monitor not found' })
    update(
        @Param('id') id: string,
        @Req() req: RequestWithUser,
        @Body() dto: UpdateMonitorDto,
    ) {
        if (!req.user?.userId) {
            throw new UnauthorizedException('User ID is missing');
        }
        return this.monitorsService.update(id, req.user.userId, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a monitor' })
    @ApiResponse({ status: 200, description: 'Monitor deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Monitor not found' })
    delete(@Param('id') id: string, @Req() req: RequestWithUser) {
        if (!req.user?.userId) {
            throw new UnauthorizedException('User ID is missing');
        }
        return this.monitorsService.delete(id, req.user.userId);
    }
}
