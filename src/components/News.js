import React,{ useEffect, useState } from "react";
import NewsItems from "./NewsItems";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News =(props)=>{
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResult, setTotalResult] = useState(0)

  const capitalizerFirstLetter =(string)=>{
  return string.charAt(0).toUpperCase()+string.slice(1);
}

  const upDateNews=async ()=>{
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(40);
    let parsedData = await data.json();
    console.log(parsedData);
    props.setProgress(60);

    setArticles(parsedData.articles);
    setTotalResult(parsedData.totalResult)
    setLoading(false)
    props.setProgress(100);
  }

useEffect(() => {
    // document.title=`${this.capitalizerFirstLetter(props.category)} - NewsMonkey` 
    upDateNews()
}, [])

const fetchMoreData =   async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    // this.setState({loading:true});
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles))
    setTotalResult(parsedData.totalResult)
};

    return (
      <>
        <h1 className="text-center" style={{margin:'25px 0px ', marginTop:'90px'}}>NewsMonkey - Top {capitalizerFirstLetter(props.category)} Headlines</h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!==totalResult}
          loader={<Spinner/>}
        >
        <div className="container">
        <div className="row">
          { articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItems
                  title={element.title ? element.title.slice(0, 45) : ""}
                  description={  element.description ? element.description.slice(0, 85) : "" }
                  imageUrl={element.urlToImage}  newsUrl={element.url} author={element.author} dat={element.publishedAt} source={element.source.name}
                />
              </div>
            );
          })}
        </div>
        </div>
        </InfiniteScroll>
      </>
    );
  }

News.defaultProps = {
  country: 'in',
  pageSize: 6,
  category:'general'
};
News.propsType = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string

};
export default News
