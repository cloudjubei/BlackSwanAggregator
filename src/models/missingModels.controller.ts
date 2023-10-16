import { Controller } from '@nestjs/common'
import { ApiExtraModels } from '@nestjs/swagger'
import StringObject from 'commons/models/StringObject.dto'

@ApiExtraModels(StringObject)
@Controller()
export class MissingModelsController
{
    constructor() {}
}
