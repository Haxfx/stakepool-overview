import {
  createServer,
  Model,
  hasMany,
  RestSerializer,
  Factory,
} from "miragejs"
import faker from "faker"

const generateRandomLetter = (length = 3) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let str = '';
  for (let i = 0; i < length; i++) {
      str += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return str;
}

export default function () {
  createServer({
    serializers: {
      stakepool: RestSerializer.extend({
        include: ["category"],
        embed: true,
      }),
    },

    models: {
      category: Model.extend({
        stakepools: hasMany(),
      }),

      stakepool: Model.extend({
        category: hasMany(),
      }),
    },

    factories: {
      category: Factory.extend({
        name() {
          return generateRandomLetter(5);
        },
      }),
      
      stakepool: Factory.extend({
        text(i) {
          return `Stakepool ${i+1}`
        },
        ticker() {
          return generateRandomLetter()
        },

        launchDate() {
          return faker.date.past().toLocaleDateString()
        },
      }),
    },

    seeds(server) {
      server.create("category", {
        stakepools: server.createList("stakepool", 2),
      });

      //server.createList("category", 1);

      server.create("category", {
        name: "Mental Health",
        stakepools: server.createList("stakepool", 3),
      });

      server.create("category", {
        name: "Africa",
        stakepools: server.createList("stakepool", 1),
      });

      server.create("category", {
        name: "Music",
        stakepools: server.createList("stakepool", 3),
      });

      server.create("category", {
        name: ["Charity", `${server.db._collections[0]._records[2].name}`, `${server.db._collections[0]._records[3].name}`],
        stakepools: server.createList("stakepool", 3),
      });
    },

    routes() {
      this.get("/api/stakepools", (schema) => {
        return schema.stakepools.all()
      })

      this.get("/api/categories", (schema) => {
        return schema.categories.all()
      })

      this.get("/api/categories/:name/stakepools", (schema, request) => {
        let categoryName = request.params.name;
        let category = schema.categories.findBy({name: categoryName})
      
        return category.stakepools
      })

      this.post("/api/stakepools", (schema, request) => {
        let attrs = JSON.parse(request.requestBody)

        return schema.stakepools.create(attrs)
      })

      this.post("/api/categories", (schema, request) => {
        let attrs = JSON.parse(request.requestBody)

        return schema.categories.create(attrs)
      })

      this.delete("/api/stakepools/:id", (schema, request) => {
        let id = request.params.id
      
        return schema.stakepools.find(id).destroy()
      })
    },
  })
}