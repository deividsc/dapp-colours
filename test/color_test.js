const { assert } = require('chai')

const Color = artifacts.require('./Color.sol')

require('chai').use(require('chai-as-promised')).should()

contract('Color', (accounts) => {
    let contract

    before (async () => {
        contract = await Color.deployed()
    })

    describe('deployment', async () => {
        it('Deploy successfully', async () => {
            const address = contract.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('Has name', async () => {
            const name = await contract.name()
            assert.equal(name, 'Color')
        })

        it('Has symbol', async () => {
            const symbol = await contract.symbol()
            assert.equal(symbol, 'COLOR')
        })
    })

    describe('minting', async ()=> {
        it('New token creation', async () =>{
            const result = await contract.mint('#EC058E')
            const totalSupply = await contract.totalSupply()
            
            assert.equal(totalSupply, 1)
            const event = result.logs[0].args

            assert.equal(event.tokenId.toNumber(), 1, 'Correct id!')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'Correct Address!')
            assert.equal(event.to, accounts[0], 'Correct Address!')

            await contract.mint('#EC058E').should.be.rejected;
        })
    })

    describe('Indexing', async () => {
        it('Color list', async () => {
            await contract.mint('#5386E4')
            await contract.mint('#FFFFFF')
            await contract.mint('#000000')

            const totalSupply = await contract.totalSupply()

            let color
            let result = []

            for (let i = 1; i <= totalSupply; i++) {
                color = await contract.colors(i-1)
                result.push(color)
            }

            let expected = ['#EC058E','#5386E4','#FFFFFF','#000000']
            assert.equal(result.join(','), expected.join(','))
        })
    })
})  