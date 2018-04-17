import { expect } from 'chai';
import { shallow, mount } from '@vue/test-utils';
import Rank from '@/components/Rank.vue';

describe('Rank component', () => {
  it('renders rank list', () => {
    const wrapper = shallow(Rank, {
      clone: false,
      propsData: {
        funds: 100,
      },
    });
    expect(wrapper.text()).to.include('Crypto God');

    wrapper.setProps({
      funds: 101,
    });
    expect(wrapper.find('b-list-group-item[variant="primary"]').text()).to.include('Noob');

    wrapper.setProps({
      funds: 1000001,
    });
    expect(wrapper.find('b-list-group-item[variant="primary"]').text()).to.include('Crypto God');

    wrapper.setProps({
      funds: 10,
    });
    expect(wrapper.find('b-list-group-item[variant="primary"]').text()).to.include('Dead');
  });
});


