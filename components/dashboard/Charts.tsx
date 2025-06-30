'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Area, AreaChart } from "recharts"
import { TrendingUp, Users, ThumbsUp } from "lucide-react"

const tokenUsageData = [
  { month: "Sty", tokeny: 2.3, koszt: 115 },
  { month: "Lut", tokeny: 3.1, koszt: 155 },
  { month: "Mar", tokeny: 2.8, koszt: 140 },
  { month: "Kwi", tokeny: 4.2, koszt: 210 },
  { month: "Maj", tokeny: 3.7, koszt: 185 },
  { month: "Cze", tokeny: 5.1, koszt: 255 },
]

const personUsageData = [
  { person: "Anna Kowalska", percentage: 35, fill: "var(--color-anna)" },
  { person: "Piotr Nowak", percentage: 28, fill: "var(--color-piotr)" },
  { person: "Maria Wisniewska", percentage: 37, fill: "var(--color-maria)" },
]

const satisfactionData = [
  { month: "Sty", positive: 78, negative: 12, neutral: 10 },
  { month: "Lut", positive: 82, negative: 9, neutral: 9 },
  { month: "Mar", positive: 75, negative: 15, neutral: 10 },
  { month: "Kwi", positive: 88, negative: 7, neutral: 5 },
  { month: "Maj", positive: 85, negative: 8, neutral: 7 },
  { month: "Cze", positive: 91, negative: 5, neutral: 4 },
]

const tokenChartConfig = {
  tokeny: {
    label: "Tokeny (mln)",
    color: "hsl(var(--chart-1))",
  },
  koszt: {
    label: "Koszt (zl)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const personChartConfig = {
  percentage: {
    label: "Procent uzycia",
  },
  anna: {
    label: "Anna Kowalska",
    color: "hsl(var(--chart-1))",
  },
  piotr: {
    label: "Piotr Nowak",
    color: "hsl(var(--chart-2))",
  },
  maria: {
    label: "Maria Wisniewska",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const satisfactionChartConfig = {
  positive: {
    label: "Pozytywne",
    color: "hsl(142, 76%, 36%)",
  },
  negative: {
    label: "Negatywne",
    color: "hsl(0, 84%, 60%)",
  },
  neutral: {
    label: "Brak reakcji",
    color: "hsl(43, 74%, 66%)",
  },
} satisfies ChartConfig

export default function Charts() {
  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Analityczny</h1>
        <p className="text-muted-foreground">
          Przeglad zuzycia tokenow, aktywnosci uzytkownikow i satysfakcji
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Zuzycie tokenow w czasie
            </CardTitle>
            <CardDescription>
              Miesieczne zuzycie tokenow w milionach i koszty w zlotowkach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={tokenChartConfig} className="min-h-[300px]">
              <BarChart data={tokenUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}M`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}zl`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    name === 'tokeny' ? `${value}M tokenow` : `${value} zl`,
                    name === 'tokeny' ? 'Tokeny' : 'Koszt'
                  ]}
                />
                
                <ChartLegend 
                content={
                  //@ts-ignore
                  <ChartLegendContent  />
                  } 
                  />
                <Bar 
                  yAxisId="left"
                  dataKey="tokeny" 
                  fill="var(--color-tokeny)" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  yAxisId="right"
                  dataKey="koszt" 
                  fill="var(--color-koszt)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Uzycie wedlug osob
            </CardTitle>
            <CardDescription>
              Procentowy podzial zuzycia tokenow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={personChartConfig} className="min-h-[300px]">
              <PieChart>
                <ChartTooltip 
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value) => [`${value}%`, 'Uzycie']}
                />
                <Pie
                  data={personUsageData}
                  dataKey="percentage"
                  nameKey="person"
                  innerRadius={60}
                  strokeWidth={2}
                  label={({percentage}) => `${percentage}%`}
                />
                <ChartLegend 
                content={
                  //@ts-ignore
                  <ChartLegendContent  />
                  }                  
                  className="flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5" />
              Wskaznik satysfakcji z odpowiedzi
            </CardTitle>
            <CardDescription>
              Procentowy rozklad feedbacku: pozytywny, negatywny i brak reakcji
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={satisfactionChartConfig} className="min-h-[300px]">
              <AreaChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [`${value}%`, name]}
                />
                <ChartLegend
                  content={
                  //@ts-ignore
                  <ChartLegendContent  />
                  } />
                <Area
                  type="monotone"
                  dataKey="positive"
                  stackId="1"
                  stroke="var(--color-positive)"
                  fill="var(--color-positive)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  stackId="1"
                  stroke="var(--color-neutral)"
                  fill="var(--color-neutral)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  stackId="1"
                  stroke="var(--color-negative)"
                  fill="var(--color-negative)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Laczne zuzycie tokenow
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21.2M</div>
            <p className="text-xs text-muted-foreground">
              +12% w porownaniu do poprzedniego okresu
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sredni koszt miesieczny
            </CardTitle>
            <span className="text-lg">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">177 zl</div>
            <p className="text-xs text-muted-foreground">
              +8% w porownaniu do poprzedniego okresu
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Srednia satysfakcja
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83%</div>
            <p className="text-xs text-muted-foreground">
              +5% w porownaniu do poprzedniego okresu
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
