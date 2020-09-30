import Enzyme from 'enzyme';
import adapter from 'enzyme-adapter-react-16';

require('dotenv').config({ path: '.env.test' });

Enzyme.configure({
  adapter: new adapter()
});