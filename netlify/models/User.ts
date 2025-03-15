import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
      // @ts-expect-error
      history: [],
      // @ts-expect-error
      chats: [], 
      notifications: [] 
   };

   // Check for changes to username or password
   if (user.isModified('username')) {
      // @ts-expect-error
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
         // @ts-expect-error
         user.data.history.push({
            timeStamp: new Date(),
            action: `profile_${field}_changed`,
            // @ts-expect-error
            data: user.profile[field] as string
         });
      });
   }

   // Only hash the password if it has been modified (or is new)
   if (user.isModified('password')) {
      // @ts-expect-error
      user.data.history.push({
         timeStamp: new Date(),
         action: 'password_changed',
         data: '*'.repeat(user.password.length)
      });
      
      try {
         // Fix: Use bcrypt directly instead of mongoose.Promise.resolve
         const salt = await bcrypt.genSalt(10);
         const hash = await bcrypt.hash(user.password, salt);
         user.password = hash;
      } catch (error) {
         return next(error as Error);
      }
   }

   return next();
});

// Ensure we're using the mongoose.model approach correctly
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;

