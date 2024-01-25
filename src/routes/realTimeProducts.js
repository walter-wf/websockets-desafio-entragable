import { Router } from "express";

const realTimeRouter = Router();

realTimeRouter.get('/', (req, res)=> {
  res.render('pages/realTimeProducts',
  {
    styles:"/styles",
    js:"/realTimeProducts.js"
  })
})

export { realTimeRouter };