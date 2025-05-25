import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Request,
    ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './DTO/create.dto';
import { UpdateProductDto } from './DTO/update.dto';
import { SessionAuthGuard } from './middlware/session.middlware';

@Controller('products')
export class ProductsController {

    constructor(private readonly productService: ProductsService) { }

    @Post('create')
    @UseGuards(SessionAuthGuard)
    create(@Body() createProductDto: CreateProductDto, @Request() req) {
        return this.productService.create(createProductDto, req.user.id);
    }



    @Get()
    findall() {
        return this.productService.findall()
    }

    @Get('/:id')
    find(@Param('id') id: number) {
        return this.productService.findOne(id);
    }


    @Delete(':id')
    @UseGuards(SessionAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.productService.remove(id, req.user.id);
    }



}
