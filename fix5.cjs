const fs = require('fs');
const path = require('path');

const corePath = path.join(__dirname, 'server/src/modules/core/index.ts');
let coreCode = fs.readFileSync(corePath, 'utf8');
coreCode = coreCode.replace(
    /const \[newItem\] = await db\.insert\(table\)\.values\(\{ \.\.\.defaultValues, \.\.\.data, updatedAt: new Date\(\)\.toISOString\(\) \} as any\)\.returning\(\);/g,
    "const newItemRes = await db.insert(table).values({ ...defaultValues, ...data, updatedAt: new Date().toISOString() } as any).returning();\n      const newItem = Array.isArray(newItemRes) ? newItemRes[0] : (newItemRes as any).rows[0];"
);
fs.writeFileSync(corePath, coreCode);

console.log("Fixes step 5 applied.");
