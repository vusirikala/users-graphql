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
        }
    }
})

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
                return _.find(users, {id : args.id})
            }
       }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})