const fs = require('fs');
const path = require('path');

const corePath = path.join(__dirname, 'server/src/modules/core/index.ts');
let coreCode = fs.readFileSync(corePath, 'utf8');

// 1. Fix parseInt
coreCode = coreCode.replace(/parseInt\((c\.req\.param\('[^']+'\))\)/g, "parseInt($1 as string)");
coreCode = coreCode.replace(/parseInt\(c\.req\.param\('id'\)\)/g, "parseInt(c.req.param('id') as string)"); // Just to be sure

// 2. Fix line 453 const [updated]
coreCode = coreCode.replace(
    /const \[updated\] = await db\.update\(table\)\.set\((updateData as any|updateData)\)\.where\(eq\(table\.id, (id|settings\[0\]\.id)\)\)\.returning\(\);/g,
    "const updatedRes = await db.update(table).set($1).where(eq(table.id, $2)).returning();\n    const updated = Array.isArray(updatedRes) ? updatedRes[0] : (updatedRes as any).rows[0];"
);

fs.writeFileSync(corePath, coreCode);

console.log("Final fixes applied.");
