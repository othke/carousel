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
    console.log('_____________________________')
    console.log(`offsetLeft ${thumbNode.offsetLeft}`)
    console.log(`offsetLeft + thumb width ${thumbNode.offsetLeft + thumbNode.clientWidth}`)
    const offsetLeftThumb = thumbNode.offsetLeft + thumbNode.clientWidth;
    const wrapperNode = this.wrapperRef.current
    if (offsetLeftThumb > wrapperNode.clientWidth) {
      const offsetLeftThumbDelta = offsetLeftThumb - wrapperNode.clientWidth
      console.log(`outside of ${offsetLeftThumbDelta}`)
      const ulNode = this.ulRef.current;
      ulNode.style.left = `-${offsetLeftThumbDelta}px`;
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
    const newIndex = currentIndex + evo;
    if (newIndex < 0 || newIndex > images.length - 1) {
      return;
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
