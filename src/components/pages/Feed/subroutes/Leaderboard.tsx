import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Eye, Heart, Trophy, Users } from 'lucide-react';


const feedPosts = [
  {
    id: 1,
    author: "Sarah Chen",
    authorBio: "Tech Writer & Digital Nomad",
    avatar: "SC",
    title: "The Future of Remote Work: Beyond the Hype",
    snippet: "As we navigate the post-pandemic world, remote work has evolved from a necessity to a strategic advantage. But what does the future really hold?",
    content: "The landscape of work has fundamentally shifted. Companies that once resisted remote work are now embracing it as a competitive advantage...",
    tags: ["Remote Work", "Technology", "Future"],
    upvotes: 247,
    comments: 34,
    timeAgo: "2 hours ago",
    readTime: "5 min read",
    category: "Technology"
  },
  {
    id: 2,
    author: "Marcus Rodriguez",
    authorBio: "Investigative Journalist",
    avatar: "MR",
    title: "The Hidden Cost of Social Media on Democracy",
    snippet: "An in-depth investigation into how algorithmic feeds are reshaping political discourse and what it means for democratic institutions.",
    content: "Democracy thrives on informed debate and diverse perspectives. But what happens when algorithms decide what we see?",
    tags: ["Politics", "Social Media", "Democracy"],
    upvotes: 189,
    comments: 67,
    timeAgo: "4 hours ago",
    readTime: "8 min read",
    category: "Politics"
  },
  {
    id: 3,
    author: "Aisha Patel",
    authorBio: "Philosophy & Ethics Writer",
    avatar: "AP",
    title: "Ancient Wisdom for Modern Minds: Stoicism in the Digital Age",
    snippet: "How the teachings of Marcus Aurelius and Epictetus can help us navigate information overload and digital anxiety.",
    content: "In an age of constant connectivity and endless notifications, ancient Stoic philosophy offers surprising relevance...",
    tags: ["Philosophy", "Stoicism", "Mental Health"],
    upvotes: 156,
    comments: 23,
    timeAgo: "6 hours ago",
    readTime: "6 min read",
    category: "Philosophy"
  },
  {
    id: 4,
    author: "James Wilson",
    authorBio: "Science Communicator",
    avatar: "JW",
    title: "The Quantum Revolution: What It Means for Computing",
    snippet: "Quantum computing is moving from theory to reality. Here's what breakthrough developments mean for the future of technology.",
    content: "Quantum computers promise to solve problems that would take classical computers millennia. But the reality is more nuanced...",
    tags: ["Science", "Quantum Computing", "Technology"],
    upvotes: 203,
    comments: 41,
    timeAgo: "8 hours ago",
    readTime: "7 min read",
    category: "Science"
  }
];

export function Leaderboard() {
  return (
    <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl mx-auto"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
                  <p className="text-gray-400">Track your writing journey and community impact</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/20 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Eye className="w-6 h-6 text-blue-400" />
                      <h3 className="font-semibold">Profile Views</h3>
                    </div>
                    <p className="text-3xl font-bold mb-1">12.4K</p>
                    <p className="text-green-400 text-sm">+15% this month</p>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/20 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Heart className="w-6 h-6 text-green-400" />
                      <h3 className="font-semibold">Article Reads</h3>
                    </div>
                    <p className="text-3xl font-bold mb-1">45.2K</p>
                    <p className="text-green-400 text-sm">+23% this month</p>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/20 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-6 h-6 text-purple-400" />
                      <h3 className="font-semibold">Followers Gained</h3>
                    </div>
                    <p className="text-3xl font-bold mb-1">847</p>
                    <p className="text-green-400 text-sm">+8% this month</p>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-500/20 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                      <h3 className="font-semibold">Battle Wins</h3>
                    </div>
                    <p className="text-3xl font-bold mb-1">7</p>
                    <p className="text-green-400 text-sm">+2 this month</p>
                  </Card>
                </div>

                {/* Charts and Insights */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
                    <div className="space-y-4">
                      {feedPosts.slice(0, 3).map((post, index) => (
                        <div key={post.id} className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{post.title}</p>
                            <p className="text-gray-400 text-xs">{post.upvotes} upvotes • {post.comments} comments</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Community Impact</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Articles Published</span>
                        <span className="font-bold">47</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Comments Received</span>
                        <span className="font-bold">1,234</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Writers Inspired</span>
                        <span className="font-bold">89</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Community Rank</span>
                        <span className="font-bold text-blue-400">#47</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
  );
}
