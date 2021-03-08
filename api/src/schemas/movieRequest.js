export default  {
    additionalProperties: false,
    required: ["name","ageLimit","rating"],
    properties: {
        name:     { type: "string" },
        rating:   { type: "integer" },
        year:     { type: "integer" },
        ageLimit: { type: "integer" },
        synopsis: { type: "string" },
        genres: {
            type: "array",
            items: { type: "string" }
        },
        actors: { 
            type: "array",
            items: {
                type: "object",
                properties: {
                    firstName: { type: "string" },
                    lastName:  { type: "string" }
                }
            }
        },
        director: {
            type: "object",
            properties: {
                firstName: { type: "string" },
                lastName:  { type: "string" }
            }
        },
    },
}