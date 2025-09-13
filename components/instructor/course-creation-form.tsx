import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function CourseCreationForm({ onClose, onSuccess }) {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    category: "",
    difficulty_level: "",
    price: "",
    thumbnail_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!formData.title) return "Title is required.";
    if (!formData.short_description) return "Short description is required.";
    if (!formData.category) return "Category is required.";
    if (!formData.difficulty_level) return "Difficulty level is required.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price) || 0,
          instructor_id: user.id,
          status: "draft",
        }),
      });
      const course = await response.json();
      if (!response.ok || !course.id) {
        setError(course.error || "Failed to create course");
        setLoading(false);
        return;
      }
      onSuccess && onSuccess();
      router.push(`/instructor/courses/${course.id}/manage`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>Start building your course and share your knowledge</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Complete React Development Course"
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description *</Label>
            <Input
              id="short_description"
              placeholder="A brief summary of the course"
              value={formData.short_description}
              onChange={(e) => updateFormData("short_description", e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Input
              id="description"
              placeholder="Full course description"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              placeholder="e.g., Web Development"
              value={formData.category}
              onChange={(e) => updateFormData("category", e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty_level">Difficulty Level *</Label>
            <Input
              id="difficulty_level"
              placeholder="e.g., Beginner"
              value={formData.difficulty_level}
              onChange={(e) => updateFormData("difficulty_level", e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              placeholder="0 (free) or any value"
              value={formData.price}
              onChange={(e) => updateFormData("price", e.target.value)}
              disabled={loading}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input
              id="thumbnail_url"
              placeholder="https://example.com/image.png"
              value={formData.thumbnail_url}
              onChange={(e) => updateFormData("thumbnail_url", e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}