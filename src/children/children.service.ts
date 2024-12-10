import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChildrenService {
  constructor(private prisma: PrismaService) {}

  async create(createChildDto: CreateChildDto) {
    const { name, address, wasGood, toy } = createChildDto;

    if (!wasGood && toy) {
      throw new HttpException(
        'Cannot give a toy to a child that was not good',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.child.create({
      data: {
        name,
        address,
        wasGood,
        toy,
      },
    });

    return;
  }

  findAll(address?: string) {
    if (address) {
      const children = this.prisma.child.findMany({
        where: { address },
      });
      return children;
    }

    const children = this.prisma.child.findMany();
    return children;
  }

  goodChildren() {
    const children = this.prisma.child.findMany({
      where: { wasGood: true },
    });

    return children;
  }

  async toys() {
    const toys = await this.prisma.child.findMany({
      where: { wasGood: true },
      select: { toy: true },
    });

    const toyCount = toys.reduce((acc, child) => {
      if (child.toy) {
        acc[child.toy] = acc[child.toy] ? acc[child.toy] + 1 : 1;
      }
      return acc;
    }, {});

    return toyCount;
  }

  findOne(id: number) {
    const childExists = this.prisma.child.findUnique({
      where: { id },
    });

    if (!childExists) {
      throw new HttpException('Child not found', HttpStatus.NOT_FOUND);
    }

    const child = this.prisma.child.findUnique({
      where: { id },
    });

    return child;
  }

  async update(id: number, updateChildDto: UpdateChildDto) {
    const { name, address, wasGood, toy } = updateChildDto;

    const childExists = await this.prisma.child.findUnique({
      where: { id },
    });

    if (!childExists) {
      throw new HttpException('Child not found', HttpStatus.NOT_FOUND);
    }

    if (wasGood !== undefined && wasGood !== null && !wasGood && toy) {
      throw new HttpException(
        'Cannot give a toy to a child that was not good',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!childExists.wasGood && toy) {
      throw new HttpException(
        'Cannot give a toy to a child that was not good',
        HttpStatus.CONFLICT,
      );
    }

    const child = this.prisma.child.update({
      where: { id },
      data: {
        name,
        address,
        wasGood,
        toy: wasGood === false ? null : childExists.wasGood ? toy : null,
      },
    });

    return child;
  }

  remove(id: number) {
    const childExists = this.prisma.child.findUnique({
      where: { id },
    });

    if (!childExists) {
      throw new HttpException('Child not found', HttpStatus.NOT_FOUND);
    }

    const child = this.prisma.child.delete({
      where: { id },
    });

    return child;
  }
}
