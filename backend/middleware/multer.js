import multer from "multer"
import fs from "fs"
import path from "path"

// Ensure temp directory exists
const tempDir = "./public/temp"
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, tempDir)
    },
    filename: function(req, file, cb) {
        // Generate a unique filename to prevent collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extension = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    }
})

export const upload = multer({storage})