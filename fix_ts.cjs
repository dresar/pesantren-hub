const fs = require('fs');
const path = require('path');

// 1. Fix admin/index.ts
const adminPath = path.join(__dirname, 'server/src/modules/admin/index.ts');
let adminCode = fs.readFileSync(adminPath, 'utf8');
adminCode = adminCode.replace(
    /const \[newSantri\] = await db.insert\(santri\)\.values\(\{([\s\S]*?)\.\.\.data,/g,
    'const [newSantri] = await db.insert(santri).values({\n    ...data,\n    email: data.email || "-",\n    noHp: data.noHp || "-",\n    nisn: data.nisn || "-",\n    asalSekolah: data.asalSekolah || "-",'
);
fs.writeFileSync(adminPath, adminCode);

// 2. Fix c.req.param('id') across the codebase
const filesToFixParam = [
    'server/src/modules/blog/index.ts',
    'server/src/modules/core/index.ts',
    'server/src/modules/publication/publication.controller.ts',
    'server/src/modules/admin/index.ts',
    'server/src/modules/admissions/index.ts'
];
for (const file of filesToFixParam) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        let code = fs.readFileSync(fullPath, 'utf8');
        code = code.replace(/c\.req\.param\('id'\)/g, "(c.req.param('id') as string)");
        
        // Also fix the '[Symbol.iterator]()' error in core/index.ts
        if (file.includes('core/index.ts')) {
            code = code.replace(/const \[updated\] = await db\.update\(table\)/g, "const updatedData = await db.update(table)");
            code = code.replace(/return c\.json\(updated\);/g, "return c.json(updatedData[0] || updatedData);");
            code = code.replace(/const \[inserted\] = \(await db\.insert\(table\)/g, "const insertedData = (await db.insert(table)");
            code = code.replace(/return c\.json\(inserted\);/g, "return c.json(insertedData[0] || insertedData);");
        }
        
        fs.writeFileSync(fullPath, code);
    }
}

// 3. Fix media.service.ts
const mediaPath = path.join(__dirname, 'server/src/modules/media/media.service.ts');
if (fs.existsSync(mediaPath)) {
    let mediaCode = fs.readFileSync(mediaPath, 'utf8');
    mediaCode = mediaCode.replace(/where\(eq\(mediaAccounts\.id, file\.accountId\)\)/g, "where(eq(mediaAccounts.id, file.accountId as number))");
    mediaCode = mediaCode.replace(/performedBy: userId/g, "performedBy: userId ?? null");
    fs.writeFileSync(mediaPath, mediaCode);
}

console.log("Fixes applied.");
