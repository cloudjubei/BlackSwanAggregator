import { OpenAPIObject } from "@nestjs/swagger"

const SWAGGER_PATH = "./src/spec/swagger.json"

export default function swaggerGenerate(document: OpenAPIObject)
{
    const fs = require("fs")
    
    Object.values(document.paths).forEach((path: any) => {
        Object.values(path).forEach((method: any) => {
            if (method.security && JSON.stringify(method.security).includes('public')) {
                method.security = []
            }
        })
    })
    Object.values(document.components.schemas).forEach((schema: any) => {
        if (schema.properties){
            Object.values(schema.properties).forEach((property: any) => {
                if (property["allOf"]){
                    property["$ref"] = property["allOf"][0]["$ref"]
                    delete property["allOf"]
                }
            })
        }
    })
    fs.writeFile(SWAGGER_PATH, JSON.stringify(document), err => {
        if (err) {
            console.error(err)
            return
        }
    })  
}