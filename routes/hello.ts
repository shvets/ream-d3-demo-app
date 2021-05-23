// routes/hello.ts
import { ReamServerHandler } from 'ream/server'

const handler: ReamServerHandler = (req, res) => {
  res.send({ hello: 'from Ream' })
}

export default handler
