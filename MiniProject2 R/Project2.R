install.packages("reshape2")
install.packages("ggplot2")
install.packages("plotly")
install.packages("tidyverse")
library(tidyverse)
library(plyr)
library(plotly)
library(rjson)
library(reshape2)
library(ggplot2)
library(scales)
#Quation 1
json_file <- "Mini-project-2-data.json"
json_data <- fromJSON(sprintf("[%s]", paste(readLines(json_file),collapse=",")))
listAuthor <- lapply(json_data, `[[`, "authors")
listAuthor1=do.call(c, unlist(listAuthor, recursive=FALSE))

listid=listAuthor1[names(listAuthor1[])=="ids"]
listname=listAuthor1[names(listAuthor1[])=="name"]
for (i in 1:length(listid)){
  if (length(listid[[i]])<1){
    print (i) 
    listid[[i]]="unknown"
  }
}
dataid=data.frame(id=names(listid), Value=unlist(listid))
dataname=data.frame(id=names(listname), Value=unlist(listname))

dataauthor=merge(dataid,dataname,by=0,all=TRUE)
dataauthor=dataauthor[dataauthor$Value.x!="unknown",]
dataauthorcount=count(dataauthor, c('Value.x'))
dataauthorcount=dataauthorcount[with(dataauthorcount, order(-freq)), ]
graph1data=dataauthorcount[1:10,]


graph1data=merge(graph1data,dataauthor[,c("Value.x","Value.y")],by="Value.x",all.x= FALSE,all.y=FALSE,stringsAsFactors = FALSE)
graph1data=graphdata[!duplicated(graphdata$Value.x),]

colnames(graph1data) <- c("id","Number","author")
graph1data=graph1data[with(graph1data, order(-Number)), ]
rownames(graph1data) <- 1:nrow(graph1data)
graph1data$author <- factor(graph1data$author)

p=ggplot(data=graph1data, aes(x=Value.y, y=freq)) +
  geom_bar(stat="identity", fill="steelblue")+geom_text(aes(label=freq), vjust=-0.3, size=3.5)+
  theme_minimal()


p=plot_ly(
  x = graph1data[,'author'],
  y = graph1data[,'Number'],
  name = "Top Authors",
  type = "bar"
)
p
#Question2

listincit <- lapply(json_data, `[[`, "inCitations")
listmainid <- lapply(json_data, `[[`, "id")
listmaintitle <- lapply(json_data, `[[`, "title")

datamainid=data.frame(mainid=unlist(listmainid))
datamaintitle=data.frame(maintitle=unlist(listmaintitle))
dataarticle=merge(datamainid,datamaintitle,by=0,all=TRUE)

datacit=data.frame(mainid=unlist(listincit))
datacitcount=count(datacit, c('mainid'))
datacitcount1=datacitcount[with(datacitcount, order(-freq)), ]

datacitcount1=datacitcount1[1:10000,]
datacitcount1=merge(datacitcount1,dataarticle[,c("mainid","maintitle")],by="mainid",all.x= TRUE,all.y=FALSE)
datacitcount1=datacitcount1[!is.na(datacitcount1$maintitle),]
datacitcount1=datacitcount1[with(datacitcount1, order(-freq)), ]

datacitcount1=datacitcount1[1:5,]
datacitcount1$maintitle=factor(datacitcount1$maintitle)
rownames(datacitcount1) <- 1:nrow(datacitcount1)

p2= ggplot(datacitcount1, aes(maintitle, freq, fill = maintitle)) +
  geom_bar(width = 1, stat = "identity", color = "white")  + 
  scale_y_continuous(breaks = 0:nlevels(datacitcount1$maintitle)) +
  scale_fill_brewer(palette="Dark2")+
  geom_text(aes(label=freq), vjust=-0.3, size=3.5) +
  theme(axis.ticks = element_blank(),
        axis.text = element_blank(),
        axis.title = element_blank(),
        axis.line = element_blank()) +coord_polar() 

p3 <- plot_ly(datacitcount1, y=~rownames(datacitcount1), type = 'scatter', mode = 'markers', size = ~freq, color = ~maintitle, colors = 'Paired',
              marker = list(opacity = 0.5),
              text = ~paste(maintitle)) %>%
         layout(title = 'Top 5 Articles',
         yaxis = list(showgrid = FALSE),
         showlegend = FALSE)

p2
#Question3

listmainid <- lapply(json_data, `[[`, "id")
listyear <- lapply(json_data, `[[`, "year")


datayear=data.frame(year=unlist(listyear))
datayearcount=count(datayear, c('year'))

p4 = ggplot(datayearcount, aes(x=year,y=freq, group=1)) + 
  geom_line(color="red") + geom_point()+
  labs(title="Q3 Yearly Publish", 
       subtitle="Articles published each year", 
       y="Articles")  + geom_text(aes(label=freq), vjust=-0.3, size=3.5)
p4

p5 <- datayearcount %>%
  plot_ly(labels = ~year, values = ~freq,textposition = 'inside',
          textinfo = 'label+percent') %>%
  add_pie(hole = 0.6) %>%
  layout(title = "Article published each year",  showlegend = F,
         xaxis = list(showgrid = FALSE, zeroline = FALSE, showticklabels = FALSE),
         yaxis = list(showgrid = FALSE, zeroline = FALSE, showticklabels = FALSE),
         showlegend = T)
p5
