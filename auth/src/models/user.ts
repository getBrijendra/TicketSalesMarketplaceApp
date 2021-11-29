import mongoose from "mongoose"
import { Password } from "../services/password"

/* Issues when working with mongoose and typescript.
1.  mongoose does not pass enough info about arguments when creating documents. 
        ex . const user = new User({email: abc@gmail.com, password: 'abjcbjd'})
2.  mongoose add extra property to returned objects 
        like user will have email, password but also createdTime, updateTime
*/

//An interface that describes the properties that are required to create a new user
interface UserAttrs {
    email: string,
    password: string
}

//An interface that describes the properties that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

//An interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
    email: string,
    password: string,
    //updatedAt: string
}

const userSchema = new mongoose.Schema({
    email: {
        type: String, //these String type are of mongoose not of typescript
        required: true
    },
    password: {
        type: String, 
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.password
            delete ret.__v
        }
    }
})


userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed)
    }
    done() 
})


userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

//const User = mongoose.model<any, UserModel>('User', userSchema)
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

// const buildUser = (attrs: UserAttrs) => {
//     return new User(attrs)
// }

// User.build({
//     email: 'test@test.com',
//     password: 'password'
// })

export { User }


