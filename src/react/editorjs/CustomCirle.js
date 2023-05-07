class CustomCircle {
    static get toolbox() {
      return {
        title: 'Custom Circle',
        icon: '<svg width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="8.5" r="7.5" fill="#FFF" stroke="#000"/></svg>',
      };
    }
  
    constructor({data, api}) {
      this.api = api;
      this._data = data;
      this._element = null;
    }
  
    render() {
      this._element = document.createElement('input');
      this._element.setAttribute('type', 'text');
      this._element.addEventListener('input', () => {
        this._data = {
          text: this._element.value,
        };
      });
      this._element.value = this._data?.text ?? '';
  
      return this._element;
    }
  
    save() {
      return {
        text: this._element.value,
      };
    }
  }
  
  export default CustomCircle;
  