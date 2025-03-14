

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
   id: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
   },
   username: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   profile:{
      firstName: String,
      lastName: String,
      email: String,
      bio: String,
      profilePicture: String,
      location: String,
      birthday: Date,
      lastSeen: Date,
   },
   data: {
      friends: [String],
      friendRequests: [String],
      history: [{
         timeStamp: Date,
         action: String,
         data: String,
      }],
      chats: [{
         chatId: String,
         chatName: String,
         chatType: String,
         chatMembers: [String],
      }],
      notifications: [{
         timeStamp: Date,
         type: String,
         data: String,
         read: Boolean,
      }],
   },
});

// Pre-save hook to hash password if modified
UserSchema.pre('save', async function(next) {
   
   // Track changes to username, password, and profile data
   const user = this;
   if(!user.data) user.data = { 
      friends: [], 
      friendRequests: [],
      // @ts-ignore 
      history: [],
      // @ts-ignore
      chats: [], 
      notifications: [] 
   };

   

      
   
   // Check for changes to username or password
   if (user.isModified('username')) {
      // @ts-ignore
      user.data.history.push({
         timeStamp: new Date(),
         action: 'username_changed',
         data: user.username
      });
   }
   
   // Check for changes to profile fields
   if (user.isModified('profile')) {
      const modifiedPaths: string[] = user.modifiedPaths()
             .filter((path: string) => path.startsWith('profile.'));    
      modifiedPaths.forEach(path => {
         const field = path.split('.')[1];
         // @ts-ignore
         user.data.history.push({
            timeStamp: new Date(),
            action: `profile_${field}_changed`,
            // @ts-ignore
            data: user.profile[field] as string
         });
      });
   }

   // Only hash the password if it has been modified (or is new)
   if (user.isModified('password')) {
      // @ts-ignore
      user.data.history.push({
             timeStamp: new Date(),
             action: 'password_changed',
             data: '*'.repeat(user.password.length)
           });
      try {
         const salt = await mongoose.Promise.resolve(require('bcrypt').genSalt(10));
         const hash = await mongoose.Promise.resolve(require('bcrypt').hash(user.password, salt));
         user.password = hash;
         next();
      } catch (error) {
         // @ts-ignore
         return next(error);
      }
   }

   return next();
});


export default mongoose.models.User || mongoose.model('User', UserSchema);

