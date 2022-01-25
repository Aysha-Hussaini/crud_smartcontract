const { assert } = require("console");
const { CONNREFUSED } = require("dns");

const Crud = artifacts.require('Crud');

contract('crud', () => {
   let crud = null;
   before (async() => {
      crud = await Crud.deployed();
   });
   
   it ('Should create new user', async () => {
      await crud.create('Aysha');
      const newUser = await crud.read(1);
      assert( newUser[0].toNumber() === 1);
      assert(newUser[1] === 'Aysha');
   } );

   it ('Should update an existing user', async() => {
      await crud.update(1, 'Manal');
      const updatedUser = await crud.read(1);
      assert(updatedUser[0].toNumber() ===1);
      assert (updatedUser[1] === 'Manal');
   });

   it('Should Not update a non-existing user', async() => {
      
      try {
         await crud.update(13 ,'Hammad');
      }
      catch(e){
         assert (e.message.includes('User does not exist!'));
         return;
      }
      assert(false);
   });

   it('Should delete the existing user', async()=>{
      await crud.deletE(1);
      try{
         let user = await crud.read(1);
      }catch(e){
         assert (e.message.includes('User does not exist!'));
         return;
      }
      assert(false);
   });

   it('Should not delete a non-existing user', async() =>{
      try{
         await crud.deletE(3);
      }catch(e){
         assert (e.message.includes('User does not exist!'));
         return;
      }
      assert(false);
   });
})