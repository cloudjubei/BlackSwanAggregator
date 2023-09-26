import StringObject from './StringObject.dto'
import { Controller } from '@nestjs/common'
import { ApiExtraModels } from '@nestjs/swagger'

@ApiExtraModels(StringObject)
@Controller()
export class MissingModelsController
{
    constructor() {}
}
