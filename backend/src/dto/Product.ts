import { IsDateString, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ProductInterface } from "../interfaces/product.interface";

export class ProductDTO implements ProductInterface {
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    id: string;
    
    @MinLength(5)
    @MaxLength(100)
    name: string;
    
    @MinLength(10)
    @MaxLength(200)
    description: string;
    
    @IsNotEmpty()
    logo: string;
    
    @IsDateString()
    date_release: Date;
    
    @IsDateString()
    date_revision: Date;
}