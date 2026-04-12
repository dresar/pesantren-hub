const fs = require('fs');
const path = require('path');

const corePath = path.join(__dirname, 'server/src/modules/core/index.ts');
let coreCode = fs.readFileSync(corePath, 'utf8');

coreCode = coreCode.replace(
    /const \[newItem\] = await db\.insert\(table\)\.values\(\{ \.\.\.defaultValues, \.\.\.data, updatedAt: new Date\(\)\.toISOString\(\) \} as any\)\.returning\(\);/g,
    "const newItemRes2 = await db.insert(table).values({ ...defaultValues, ...data, updatedAt: new Date().toISOString() } as any).returning();\n      const [newItem] = Array.isArray(newItemRes2) ? newItemRes2 : (newItemRes2 as any).rows;"
);

fs.writeFileSync(corePath, coreCode);

console.log("Final last fix applied.");
