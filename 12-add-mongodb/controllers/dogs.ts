import { Router } from "https://deno.land/x/oak/mod.ts";

const data = JSON.parse(Deno.readTextFileSync("./controllers/dogs.data.json"));

interface Dog {
  name: string;
  age: number;
}

let dogs: Array<Dog> = data;

/* LIST */
export const getDogs = ({ response }: { response: any }) => {
  response.body = dogs;
};

/* READ */
export const getDog = ({
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
  response.status = 404;
  response.body = { msg: `Cannot find dog ${params.name}` };
};

/* CREATE */
export const addDog = async ({
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
export const updateDog = async ({
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
export const removeDog = ({
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
  .get("/dogs", getDogs)
  .get("/dogs/:name", getDog)
  .post("/dogs", addDog)
  .put("/dogs/:name", updateDog)
  .delete("/dogs/:name", removeDog);

export default dogsRouter;
