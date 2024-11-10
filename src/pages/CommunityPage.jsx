import React, { useState } from 'react';
import { User, MessageSquare, Heart, Share2 } from 'lucide-react';

const CommunityPage = () => {
  const [posts, setPosts] = useState([
    { id: 1, user: 'JohnDoe', content: 'Just completed a 5K run! Feeling great!', likes: 15, comments: 3 },
    { id: 2, user: 'JaneSmith', content: 'New personal best in deadlifts today! 💪', likes: 23, comments: 7 },
    { id: 3, user: 'FitnessFanatic', content: 'Anyone interested in joining a virtual yoga session this weekend?', likes: 8, comments: 12 },
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const newPostObj = {
        id: posts.length + 1,
        user: 'CurrentUser',
        content: newPost,
        likes: 0,
        comments: 0,
      };
      setPosts([newPostObj, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Fitness Community</h1>
      
      <form onSubmit={handlePostSubmit} className="mb-8">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your fitness journey..."
          className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        ></textarea>
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
          Post
        </button>
      </form>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <User className="w-10 h-10 text-gray-500 mr-2" />
              <span className="font-semibold">{post.user}</span>
            </div>
            <p className="mb-4">{post.content}</p>
            <div className="flex justify-between text-gray-500">
              <button className="flex items-center hover:text-blue-500">
                <Heart className="w-5 h-5 mr-1" /> {post.likes}
              </button>
              <button className="flex items-center hover:text-blue-500">
                <MessageSquare className="w-5 h-5 mr-1" /> {post.comments}
              </button>
              <button className="flex items-center hover:text-blue-500">
                <Share2 className="w-5 h-5 mr-1" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;