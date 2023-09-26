import fs from 'fs'

export const checkIfFileOrDirectoryExists = (path: string) : boolean =>
{
    return fs.existsSync(path)
}

export const getFileAsync = async (path: string) : Promise<string> =>
{
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(data.toString())
        })
      })
}
export const getFile = (path: string) : string =>
{
    return fs.readFileSync(path).toString()
}

export const createOrWriteToFileAsync = async (path: string, fileName: string, data: string) : Promise<void> =>
{
    return new Promise((resolve, reject) => {
        const writeFile = () => {
            fs.writeFile(`${path}/${fileName}`, data, 'utf8', (err) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve()
            })
        }
        if (!checkIfFileOrDirectoryExists(path)) {
            fs.mkdir(path, (err) => {
                if (err) {
                    reject(err)
                    return
                }
                writeFile()
            })
        }else{
            writeFile()
        }
    })
}
export const createOrWriteToFile = (path: string, fileName: string, data: string) =>
{
    if (!checkIfFileOrDirectoryExists(path)) {
        fs.mkdirSync(path)
    }

    fs.writeFileSync(`${path}/${fileName}`, data, 'utf8')
}

export const deleteFileAsync = async (path: string) : Promise<void> =>
{
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) {
                reject(err)
                return
            }
            resolve()
        })
    })
}
export const deleteFile = (path: string) =>
{
    fs.unlinkSync(path)
}