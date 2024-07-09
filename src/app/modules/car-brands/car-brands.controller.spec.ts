import { Test, TestingModule } from '@nestjs/testing';
import { CarBrandsController } from './car-brands.controller';

describe('CarBrandsController', () => {
  let controller: CarBrandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarBrandsController],
    }).compile();

    controller = module.get<CarBrandsController>(CarBrandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
