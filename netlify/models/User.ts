

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
      friends: {
         type: [String],
         default: [],
      },
      friendRequests: {
         type: [String],
         default: [],
      },
      history: {
         type: [{
            timeStamp: Date,
            action: String,
            data: String,
         }],
         default: [],
      },
      chats:{
         type: [{
            chatId: String,
            chatName: String,
            chatType: String,
            chatMembers: [String],
         }],
         default: [],
      },
      notifications: {
         type: [{
            timeStamp: Date,
            type: String,
            data: String,
            read: Boolean,
         }],
         default: [],
      },
   },
});

// Pre-save hook to hash password if modified
UserSchema.pre('save', async function(next) {
   const user = this;
   
   // Track changes to username, password, and profile data
   const user = this;
   
   // Check for changes to username or password
   if (user.isModified('username')) {
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
         user.data.history.push({
            timeStamp: new Date(),
            action: `profile_${field}_changed`,
            data: user.profile[field]
         });
      });
   }

   // Only hash the password if it has been modified (or is new)
   if (user.isModified('password')) {
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
         return next(error);
      }
   }

   return next();
});


export default mongoose.models.User || mongoose.model('User', UserSchema);

