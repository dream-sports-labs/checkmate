import {generateRbacPolicy} from './rbacPolicyGeneration'
import fs from 'fs-extra'
import path from 'path'

const rbacPolicy = generateRbacPolicy()
const __dirname = process.env.INIT_CWD ?? ''

fs.writeFileSync(
  path.join(__dirname, 'app/services/rbac/rbac-policy.json'),
  JSON.stringify({rbacPolicy}, null, 2),
)
