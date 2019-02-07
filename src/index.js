import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import './styles.css';

const images = _.range(0, 22).map(id => {
  const src = `https://www.fillmurray.com/300/${300 + id}/`;
  return { id, src };
});

class Carousel extends React.Component {
  render() {
    const { image, onChange } = this.props;
    return (
      <div className="carousel">
        <div onClick={() => onChange(-1)} className="arrow">
          {'<'}
        </div>
        <div className="mainImage">
          <img src={image.src} />
        </div>
        <div onClick={() => onChange(1)} className="arrow">
          {'>'}
        </div>
      </div>
    );
  }
}

class Thumb extends React.Component {
  constructor(props) {
    super(props);
    this.thumbRef = React.createRef();
  }

  componentDidUpdate() {
    const { focus, parent, checkLeftOffset } = this.props;
    if (!focus) {
      return;
    }
    const { current: node } = this.thumbRef;
    checkLeftOffset(node);
  }

  render() {
    const { src, focus, wrapperHeight } = this.props;
    return (
      <li ref={this.thumbRef} className={`thumb ${focus ? 'focus' : ''}`}>
        <img src={src} />
      </li>
    );
  }
}

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.ulRef = React.createRef();
  }

  checkLeftOffset = thumbNode => {
    const thumbWidth = thumbNode.getBoundingClientRect().width
    const thumbLeftPosition = thumbNode.offsetLeft
    const wrapperNode = this.wrapperRef.current
    const wrapperWidth = wrapperNode.getBoundingClientRect().width;
    console.log('__________________________________')
    console.log(`thumbLeftPosition ${thumbLeftPosition}`)
    const ulNode = this.ulRef.current;

    // depassement à droite
    if (thumbLeftPosition + thumbWidth > wrapperWidth ) {
      const outsideOffset = wrapperWidth - (thumbLeftPosition + thumbWidth)
      console.log(`outside ${outsideOffset}`)
      ulNode.style.left = `${outsideOffset}px`;
    }
    else if(thumbLeftPosition < thumbWidth) {
      ulNode.style.left = `0`;
    }

  };

  render() {
    const { images, currentIndex, wrapperHeight, thumbHeight } = this.props;
    return (
      <div ref={this.wrapperRef} id="wrapper" className="wrapper">
        <ul ref={this.ulRef} className="thumbList">
          {images.map(({ id, src }) => {
            return (
              <Thumb
                key={id}
                src={src}
                focus={id === currentIndex}
                parent={this.ulRef}
                checkLeftOffset={this.checkLeftOffset}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}

class App extends React.Component {
  state = { currentIndex: 0 };

  changePhoto = evo => {
    const { images } = this.props;
    const { currentIndex } = this.state;
    let newIndex = currentIndex + evo;
    if(newIndex < 0) {
      newIndex = images.length -1
    }
    else if (newIndex >= images.length){
      newIndex = 0
    }
    this.setState({ currentIndex: newIndex });
  };

  render() {
    const { images } = this.props;
    const { currentIndex } = this.state;
    const currentImage = images[currentIndex];
    return (
      <div className="App">
        <Carousel image={currentImage} onChange={this.changePhoto} />
        <Wrapper images={images} currentIndex={currentIndex} />
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App images={images} />, rootElement);
