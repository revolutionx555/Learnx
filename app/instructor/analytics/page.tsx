"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Target, Award, Activity, Eye, Loader2 } from "lucide-react"

async function getAnalyticsData() {
  try {
    const response = await fetch("/api/instructor/analytics", {
      cache: "no-store",
    })
    if (!response.ok) throw new Error("Failed to fetch analytics data")
    return await response.json()
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return {
      overview: {
        totalViews: 0,
        completionRate: 0,
        avgRating: 0,
        activeStudents: 0,
      },
      coursePerformance: [],
      studentActivity: [],
      engagementMetrics: [],
      completionRates: [],
      popularContent: [],
      timeSpentData: [],
      deviceStats: [],
    }
  }
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnalyticsData()
        setAnalyticsData(data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your teaching performance</p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Course video views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Average across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.avgRating}/5</div>
            <p className="text-xs text-muted-foreground">Student feedback score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.activeStudents}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Course Performance</TabsTrigger>
          <TabsTrigger value="engagement">Student Engagement</TabsTrigger>
          <TabsTrigger value="content">Content Analytics</TabsTrigger>
          <TabsTrigger value="insights">Advanced Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Course Completion Rates</CardTitle>
                <CardDescription>Track how students progress through your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.completionRates.length > 0 ? (
                    analyticsData.completionRates.map((course, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="truncate">{course.courseName}</span>
                          <span className="font-medium">{course.completionRate}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${course.completionRate}%` }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No completion data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Activity Heatmap</CardTitle>
                <CardDescription>When your students are most active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.studentActivity.length > 0 ? (
                    analyticsData.studentActivity.slice(0, 12).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{activity.hour}:00</span>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (activity.activeStudents /
                                    Math.max(...analyticsData.studentActivity.map((a) => a.activeStudents))) *
                                    100,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{activity.activeStudents}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No activity data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Performance Overview</CardTitle>
              <CardDescription>Detailed metrics for each of your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.coursePerformance.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{course.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{course.enrollments} students</span>
                        <span>{course.completionRate}% completion</span>
                        <span>{course.avgRating}/5 rating</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          course.completionRate >= 70
                            ? "default"
                            : course.completionRate >= 50
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {course.completionRate >= 70
                          ? "Excellent"
                          : course.completionRate >= 50
                            ? "Good"
                            : "Needs Improvement"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>How students interact with your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {analyticsData.engagementMetrics.length > 0 ? (
                    analyticsData.engagementMetrics.map((metric, index) => (
                      <div key={index} className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{metric.score}%</div>
                        <div className="text-sm text-muted-foreground">{metric.metric}</div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-2 text-center text-muted-foreground py-8">No engagement data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Spent Learning</CardTitle>
                <CardDescription>Average time students spend on your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.timeSpentData.length > 0 ? (
                    analyticsData.timeSpentData.slice(-8).map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Week {data.week}</span>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (data.hours / Math.max(...analyticsData.timeSpentData.map((d) => d.hours))) * 100,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{data.hours}h</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No time data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Device Usage Statistics</CardTitle>
              <CardDescription>How students access your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {analyticsData.deviceStats.length > 0 ? (
                  analyticsData.deviceStats.map((device, index) => (
                    <div key={index} className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{device.percentage}%</div>
                      <div className="text-sm text-muted-foreground">{device.name}</div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-3 text-center text-muted-foreground py-8">No device data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Content</CardTitle>
              <CardDescription>Your top-performing lessons and sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.popularContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{content.title}</h4>
                      <p className="text-sm text-muted-foreground">{content.course}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold">{content.views}</div>
                        <div className="text-muted-foreground">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{content.completionRate}%</div>
                        <div className="text-muted-foreground">Completion</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{content.avgTimeSpent}m</div>
                        <div className="text-muted-foreground">Avg Time</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Learning Patterns</CardTitle>
                <CardDescription>When students learn best</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Peak Learning Hours</span>
                    <Badge>2PM - 4PM</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Most Active Day</span>
                    <Badge>Wednesday</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Session Length</span>
                    <Badge>45 minutes</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Preferred Content Type</span>
                    <Badge>Video Lessons</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Recommendations</CardTitle>
                <CardDescription>AI-powered suggestions for your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900">Add More Interactive Elements</h5>
                    <p className="text-sm text-blue-700">Courses with quizzes have 23% higher completion rates</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-900">Optimize Video Length</h5>
                    <p className="text-sm text-green-700">Consider breaking longer videos into 10-15 minute segments</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h5 className="font-medium text-orange-900">Improve Course Introduction</h5>
                    <p className="text-sm text-orange-700">30% of students drop off in the first lesson</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
