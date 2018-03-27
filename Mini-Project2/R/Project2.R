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
#Object 1
json_file <- "Mini-project-2-data.json"
json_data <- fromJSON(sprintf("[%s]", paste(readLines(json_file),collapse=",")))

newdata=json_data[which(sapply(json_data, '[[',"venue")=="ArXiv")]
listAuthor <- lapply(newdata, `[[`, "authors")
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


graph1data=merge(graph1data,dataauthor[,c("Value.x","Value.y")],by="Value.x",all.x= TRUE,all.y=FALSE)
graph1data=graph1data[!duplicated(graph1data$Value.x),]

colnames(graph1data) <- c("id","Number","author")
graph1data=graph1data[with(graph1data, order(-Number)), ]
rownames(graph1data) <- 1:nrow(graph1data)
graph1data$author <- factor(graph1data$author)

p=ggplot(data=graph1data, aes(x = reorder(author, -Number), y=Number)) + ggtitle("Top 10 Authors") + xlab("Author Name") + ylab("Article Number")+
  geom_bar(stat="identity", fill="steelblue",width = 0.8)+geom_text(aes(label=Number), vjust=-0.3, size=3.5)+
  theme(axis.text.x = element_text(angle = 60, hjust = 1))
p

#Question2

listincit <- lapply(newdata, `[[`, "inCitations")
listmainid <- lapply(newdata, `[[`, "id")
listmaintitle <- lapply(newdata, `[[`, "title")

datamainid=data.frame(id=unlist(listmainid))
datamaintitle=data.frame(title=unlist(listmaintitle))
dataarticle=data.frame(datamainid,datamaintitle)


listincit1=lapply(listincit,function(x){ifelse((length(x)<1),0,length(x))})
datacit=data.frame(citCount=unlist(listincit1))
datacitcount=data.frame(dataarticle, datacit)
datacitcount=datacitcount[with(datacitcount, order(-citCount)), ]

datacitcount=datacitcount[1:5,]
datacitcount$title=factor(datacitcount$title)


p2= ggplot(data=datacitcount, aes(x=reorder(gsub(" ","\n",title),-citCount),y=citCount)) + ggtitle("Top 5 Artilces") + 
             xlab("Article Name") + ylab ("Citation Count")+ 
             scale_color_brewer(palette="Dark2") + geom_bar(stat="identity",fill="steelblue", width=0.8)+
             geom_text(aes(label=citCount),vjust=-0.3,size=3.5)     

p2
#Question3

newdata1=json_data[which(sapply(json_data, `[[`, "venue") == "ICSE")]
listmainid <- lapply(newdata1, `[[`, "id")
listyear <- lapply(newdata1, `[[`, "year")
datayear=data.frame(year=unlist(listyear))
datayearcount=count(datayear, c('year'))
colnames(datayearcount)=c("Year","Publishes")
p4 = plot_ly(datayearcount,x = ~Year, y= ~Publishes, type="scatter",mode='lines')

p4

p5 <- datayearcount %>%
  plot_ly(labels = ~Year, values = ~Publishes,textposition = 'inside',
          textinfo = 'label+percent') %>%
  add_pie(hole = 0.6) %>%
  layout(title = "Article published each year",  showlegend = F,
         xaxis = list(showgrid = FALSE, zeroline = FALSE, showticklabels = FALSE),
         yaxis = list(showgrid = FALSE, zeroline = FALSE, showticklabels = FALSE),
         showlegend = T)
p5
