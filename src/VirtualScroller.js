import React, { Component } from 'react'
import { Container, Table} from 'react-bootstrap'

const setInitialState = (settings) => {
  const { itemHeight, amount, tolerance, minIndex, maxIndex, startIndex, colLen } = settings
  const viewportHeight = amount * itemHeight
  const totalHeight = (maxIndex - minIndex + 1) * itemHeight
  const toleranceHeight = tolerance * itemHeight
  const bufferHeight = viewportHeight + 2 * toleranceHeight
  const bufferedItems = amount + 2 * tolerance
  const itemsAbove = startIndex - tolerance - minIndex
  const topPaddingHeight = itemsAbove * itemHeight
  const bottomPaddingHeight = totalHeight - topPaddingHeight
  const initialPosition = topPaddingHeight + toleranceHeight
  return {
    settings,
    viewportHeight,
    totalHeight,
    toleranceHeight,
    bufferHeight,
    bufferedItems,
    topPaddingHeight,
    bottomPaddingHeight,
    initialPosition,
    data: [],
  }
}

class Scroller extends Component {
  constructor(props) {
    super(props)
    this.state = setInitialState(props.settings)
    this.viewportElement = React.createRef()
    this.columns = this.props.columns
  }

  componentDidMount() {
    this.viewportElement.current.scrollTop = this.state.initialPosition
    if (!this.state.initialPosition) {
      this.runScroller({ target: { scrollTop: 0 } })
    }
  }

  runScroller = ({ target: { scrollTop } }) => {
    const { totalHeight, toleranceHeight, bufferedItems, settings: { itemHeight, minIndex }} = this.state
    const index = minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight)
    const rows = this.props.rows;
    const data = this.props.get(index, bufferedItems, rows)
    const columns = ["Data"]
    const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0)
    const bottomPaddingHeight = Math.max(totalHeight - topPaddingHeight - data.length * itemHeight, 0)

    this.setState({
      topPaddingHeight,
      bottomPaddingHeight,
      data,
      rows,
    })
  }

  render() {
    const { viewportHeight, topPaddingHeight, bottomPaddingHeight, data } = this.state
    return (
      <div>
      <h1> <center> Example of VirtualScroller </center> </h1>
      <hr />

      <Container bordered
        className="viewport"
        style={{ height: viewportHeight }}
        ref={this.viewportElement}
        onScroll={this.runScroller}
      >
      <Table striped bordered hover>
        <thead>
        <tr>
          {this.columns.map((c, i) => (<th key={i}>{c}</th>))}
        </tr>
        </thead>
        <tbody>
        <tr style={{ height: topPaddingHeight }}></tr>
        {
          data.map(this.props.row)
        }
        <tr style={{ height: bottomPaddingHeight }}></tr>
        </tbody>
      </Table>
      </Container>
      </div>
    )
  }
}

export default Scroller
