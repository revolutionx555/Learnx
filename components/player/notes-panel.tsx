"use client"

import { useState, useEffect } from "react"
import { Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Note {
  id: string
  content: string
  timestamp: number
  created_at: string
}

interface NotesPanelProps {
  lessonId: string
  currentTime: number
  onSeekTo: (time: number) => void
}

export function NotesPanel({ lessonId, currentTime, onSeekTo }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [lessonId])

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/notes?lessonId=${lessonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
    }
  }

  const createNote = async () => {
    if (!newNote.trim()) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId,
          content: newNote,
          timestamp: Math.floor(currentTime),
        }),
      })

      if (response.ok) {
        const note = await response.json()
        setNotes([...notes, note])
        setNewNote("")
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Error creating note:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Notes</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Note at {formatTime(Math.floor(currentTime))}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Write your note here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNote}>Save Note</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No notes yet.</p>
            <p className="text-sm">Add your first note to remember important points!</p>
          </div>
        ) : (
          notes
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((note) => (
              <Card key={note.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSeekTo(note.timestamp)}
                    className="text-navy-600 hover:text-navy-800 p-0 h-auto font-medium"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(note.timestamp)}
                  </Button>
                  <span className="text-xs text-muted-foreground">{formatDate(note.created_at)}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{note.content}</p>
              </Card>
            ))
        )}
      </CardContent>
    </Card>
  )
}
