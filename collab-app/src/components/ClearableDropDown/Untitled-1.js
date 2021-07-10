{<form>
    <input type="text" id="message" value={this.state.inputValue} onChange={this.updateInputValue} /*onSubmit={this.publishMessage}*/></input>
    <button onClick={this.publishMessage}>Publish</button>
  </form>}