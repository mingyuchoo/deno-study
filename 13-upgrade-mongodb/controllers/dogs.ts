import { Router } from "https://deno.land/x/oak/mod.ts";

const data = JSON.parse(Deno.readTextFileSync("./controllers/dogs.data.json"));

interface Dog {
  name: string;
  age: number;
}

let dogs: Array<Dog> = data;

/* LIST */
export const selectAllDogs: any = ({ response }: { response: any }) => {
  response.body = dogs;
};

/* READ */
export const selectOneDog: any = ({
  params,
  response,
}: {
  params: {
    name: string;
  };
  response: any;
}) => {
  const dog = dogs.filter((dog) => dog.name === params.name);
  if (dog.length) {
    response.status = 200;
    response.body = dog[0];
    return;
  }
  response.status = 204;
  response.body = { msg: `Cannot find dog ${params.name}` };
};

/* CREATE */
export const insertDog: any = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const dog: Dog = { ...body.value, id: 3 };
  dogs.push(dog);

  response.status = 201;
  response.body = { msg: "Created" };
};

/* UPDATE */
export const updateDog: any = async ({
  params,
  request,
  response,
}: {
  params: {
    name: string;
  };
  request: any;
  response: any;
}) => {
  const temp = dogs.filter((existingDog) => existingDog.name === params.name);
  const body = await request.body();
  const { age }: { age: number } = body.value;

  if (temp.length) {
    temp[0].age = age;
    response.status = 200;
    response.body = { msg: "OK" };
    return;
  }
  response.status = 204;
  response.body = { msg: `No dog ${params.name}` };
};

/* DELETE */
export const deleteDog: any = ({
  params,
  response,
}: {
  params: {
    name: string;
  };
  response: any;
}) => {
  const lengthBefore = dogs.length;
  dogs = dogs.filter((dog) => dog.name !== params.name);

  if (dogs.length === lengthBefore) {
    response.status = 404;
    response.body = { msg: `Cannot find dog ${params.name}` };
    return;
  }
  response.status = 204;
  response.body = { msg: "No Content" };
};

const dogsRouter = new Router();

dogsRouter
  .get("/dogs", selectAllDogs)
  .get("/dogs/:name", selectOneDog)
  .post("/dogs", insertDog)
  .put("/dogs/:name", updateDog)
  .delete("/dogs/:name", deleteDog);

export default dogsRouter;
