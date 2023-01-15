const { default: axios } = require('axios');
const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

const users = [
    {id: '23', firstName: 'Bill', age: 20},
    {id: '47', firstName: 'Samantha', age: 21}
];

//It's very important to define the CompanyType before UserType
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        }
    }
})

//This object instructs graphql on what a User object looks like.  
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { 
            type: GraphQLString
        },
        firstName: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        //Note that JSON server database uses "companyId" and we use "company" here
        //"companyId" is of type 'Id'.  "company" is of type "Company"
        //We need to define a resolve function to resolve the difference. The incoming data has "id", the resolve function will resolve it to "Company"
        company: {                  
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(response => response.data)
            }
        }
    }
})


//A root query is something that allows us to jump in a graph of data. Eg: Find user with ID 23. 
//Root query is an entry point into an application. 
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            //args are the arguments that are required for root query on user. 
            //If id is given as argument, then UserType is returned by GraphQL
            args: { id: {type: GraphQLString} },
            //resolve function is where we go into our database and find the value we are looking for.
            //parentValue argument is notorious for rarely being used
            //args contains whatever arguments we pass into the original query
            resolve(parentValue, args) {
                // Use this statement to resolve the query by searching the JSON object
                // return _.find(users, {id : args.id})

                return axios.get(`http://localhost:3000/users/${args.id}`)
                            .then(response => response.data)
            }
       },
       company: {
            type: CompanyType,
            args: { id: {type: GraphQLString} },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                            .then(response => response.data)
            }
       }
    }
})

//GraphQLSchema takes a root query and returns a GraphQL schema instance. 
module.exports = new GraphQLSchema({
    query: RootQuery
})