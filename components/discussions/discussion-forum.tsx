"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Plus, User, Clock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Discussion {
  id: string
  title: string
  content: string
  user: {
    first_name: string
    last_name: string
    avatar_url?: string
  }
  reply_count: number
  created_at: string
}

interface DiscussionForumProps {
  courseId: string
}

export function DiscussionForum({ courseId }: DiscussionForumProps) {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()

  useEffect(() => {
    fetchDiscussions()
  }, [courseId])

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`/api/discussions?courseId=${courseId}`)
      const data = await response.json()
      setDiscussions(data.discussions || [])
    } catch (error) {
      console.error("Failed to fetch discussions:", error)
    } finally {
      setLoading(false)
    }
  }

  const createDiscussion = async () => {
    if (!title.trim() || !content.trim()) return

    try {
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId, title, content }),
      })

      if (response.ok) {
        setTitle("")
        setContent("")
        setShowCreateForm(false)
        fetchDiscussions()
      }
    } catch (error) {
      console.error("Failed to create discussion:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading discussions...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy flex items-center">
          <MessageSquare className="mr-2 h-6 w-6" />
          Course Discussions
        </h2>
        {user && (
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-gold hover:bg-gold/90 text-navy">
            <Plus className="mr-2 h-4 w-4" />
            New Discussion
          </Button>
        )}
      </div>

      {showCreateForm && (
        <Card className="border-gold/20">
          <CardHeader>
            <h3 className="text-lg font-semibold">Start a New Discussion</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Discussion title..." value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea
              placeholder="What would you like to discuss?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={createDiscussion} className="bg-navy hover:bg-navy/90">
                Post Discussion
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {discussions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No discussions yet</h3>
              <p className="text-gray-500">Be the first to start a conversation!</p>
            </CardContent>
          </Card>
        ) : (
          discussions.map((discussion) => (
            <Card key={discussion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-navy mb-2">{discussion.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{discussion.content}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {discussion.user.first_name} {discussion.user.last_name}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {discussion.reply_count} replies
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(discussion.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
