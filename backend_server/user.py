'''
Introduction:
Workshop Example Code from the Blockchain and Machine Learning Workshop at START Summit 2017 in Switzerland

Description:
The file user.py implements an easy chat-client for transmitting text and images to Blockchain smart contract.
Tags are automatically extracted from an image using a Deep Residual Neural Network.

Author:
Thomas Schmiedel, Data Reply 2017

Mail:
t.schmiedel@reply.de

Note:
This is just example code and not perfect yet, if you have any questions, advice, ..., just drop me a mail :-)
'''

##################################
# imports
##################################
from __future__ import print_function
import os, sys
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from ethjsonrpc import EthJsonRpc
import time
import io
from PIL import Image
import signal
from ethereum.abi import decode_abi
from ethereum import utils


##################################
# config
##################################
RPC_HOST = '127.0.0.1'
RPC_PORT = 8545
GAS = 20000000
IMAGE_SIZE = 256


##################################
# signal handler
##################################
LISTENING = False
def handler(sig, frame):
    global LISTENING
    if not LISTENING:
        sys.stdout.write('\nenter q or quit to leave\n>> ')
    else:
        print('\n')
    LISTENING = False
signal.signal(signal.SIGINT, handler)


##################################
# decode transaction input
##################################
class Decoder:
    @staticmethod
    def decodeABI(tinput, sig='createNewContract(string,string)'):
        abi = tinput[2 :]
        hash = utils.sha3(sig)[: 4].encode('hex')
        if abi[: 8] != hash:
            return None
        return decode_abi(['string', 'string'], abi[8 :].decode('hex'))


##################################
# main
##################################
def main():
    #
    # receive contract addr
    #
    if len(sys.argv) != 3:
        print('Usage:\npython user.py <contract addr> <account addr>')
        sys.exit(-1)
    contract_addr = sys.argv[1]
    account_addr = sys.argv[2]

    #
    # create rpc interface
    #
    try:
        print('-' * 80)
        rpc = EthJsonRpc(RPC_HOST, RPC_PORT)
        print('client software: {}'.format(rpc.web3_clientVersion()))
        print('block: {}'.format(rpc.eth_blockNumber()))
        print('address: {}'.format(rpc.eth_coinbase()))
    except:
        print('unable to connect to rpc server at {}:{}'.format(RPC_HOST, RPC_PORT))
        sys.exit(-1)

    #
    # check contract is online
    #
    print('-' * 80)
    if rpc.eth_getCode(contract_addr) == '0x0':
        print('!!! contract code not available on blockchain !!!')
        sys.exit(-1)
    print('found contract on blockchain!')
    print(rpc.eth_getCode(Decoder.decodeABI(contract_addr)))
    #
    # console
    #
    topics = []
    print('-' * 80)
    print('starting contract command line...')

    while True:
        #
        # simply read input
        #
        sys.stdout.write('>> ')
        command = sys.stdin.readline()

        #
        # quit?
        #
        if 'q' in command:
            sys.exit(0)

        #
        # show help
        #
        elif command == '\n' or 'help' in command:
            print('commands: help, send, status, topics, search, listen')

        #
        # compose new message
        #
        elif 'send' in command:
            print('-' * 80)
            print('[composing new message]')
            sys.stdout.write('partner....: ')
            partner = sys.stdin.readline().strip()
            sys.stdout.write('text.......: ')
            text = sys.stdin.readline().strip()
            print('-' * 80)
            print('sending...')
            tx = rpc.call_with_transaction(account_addr, contract_addr,
                                           'createNewContract(string,string)', [partner, text],
                                           gas=GAS)
            print('done, transaction id: {}'.format(tx))
            print(rpc.eth_blockNumber())

            trans = rpc.eth_getTransactionByHash(format(tx))
            res = Decoder.decodeABI(trans['input'])
            print(res)

            newBlock = rpc.eth_blockNumber()
            print(newBlock);
            for trans in rpc.eth_getBlockByNumber(newBlock)['transactions']:
                res = Decoder.decodeABI(trans['input'])
                print(res)
                if res is None:
                    continue
                partner, text = res

                print('-' * 80)
                print('message from user {} (block {}):'.format(trans['from'], newBlock))
                print('  partner: {}'.format(partner))
                print('  text...: {}'.format(text))

        #
        # get own last post
        #
        elif 'status' in command:
            print('-' * 80)
            print('[receiving last post]')
            partner, text = rpc.call(contract_addr, 'getContract(address)', [account_addr],
                                                        ['string','string'])
            if not text:
                print('nothing posted yet')
                continue
            print('  partner: {}'.format(partner))
            print('  text...: {}'.format(text))
        #
        # set tag filters
        #
        elif 'topics' in command:
            topics = [t.strip() for t in command.split()[1 : ]]
            if len(topics) == 0:
                print('please provide actual topics after <topics> command')
                continue
            print('filter set for messages on topics: {}'.format(topics))

        #
        # search complete blockchain for messages with certain tags
        #
        elif 'search' in command:
            if len(topics) == 0:
                print('call topics first')
                continue
            curBlock = rpc.eth_blockNumber()
            for i in range(curBlock + 1):
                for trans in rpc.eth_getBlockByNumber(i)['transactions']:
                    res = Decoder.decodeABI(trans['input'])
                    if res is None:
                        continue
                    msg, code, tags = res
                    if all(t not in tags for t in topics):
                        continue
                    print('-' * 80)
                    print('message from user {} (block {}):'.format(trans['from'], i))
                    print('  content: {}'.format(msg))
                    print('  tags...: {}'.format(tags))
                    ImageHelper.bytesToImg(code).show(title='{}'.format(tags))

        #
        # start listening for messages
        #
        elif 'listen' in command:
            global LISTENING
            LISTENING = True
            curBlock = rpc.eth_blockNumber()
            while LISTENING:
                newBlock = rpc.eth_blockNumber()
                if newBlock > curBlock:
                    print('new block detected ({})'.format(newBlock))
                    curBlock = newBlock
                    for trans in rpc.eth_getBlockByNumber(newBlock)['transactions']:
                        res = Decoder.decodeABI(trans['input'])
                        if res is None:
                            continue
                        partner, text = res

                        print('-' * 80)
                        print('message from user {} (block {}):'.format(trans['from'], newBlock))
                        print('  partner: {}'.format(partner))
                        print('  text...: {}'.format(text))
                time.sleep(1)

        #
        # default response
        #
        else:
            print('command not recognized')


##################################
# run
##################################
if __name__ == '__main__':
    main()
