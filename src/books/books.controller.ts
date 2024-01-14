import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './book.dto';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.booksService.create(createBookDto);
  }

  @Get()
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Filter books by title',
  })
  @ApiQuery({
    name: 'author',
    required: false,
    type: String,
    description: 'Filter books by author',
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    type: String,
    description: 'Filter books by genre',
  })
  @ApiQuery({
    name: 'state',
    required: false,
    type: String,
    description: 'Filter books by state',
  })
  @ApiQuery({
    name: 'country',
    required: false,
    type: String,
    description: 'Filter books by country',
  })
  async findAll(
    @Query()
    params: {
      title: string;
      author: string;
      genre: string;
      state: string;
      country: string;
    },
  ) {
    return await this.booksService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.booksService.findOne(id);
  }
}
