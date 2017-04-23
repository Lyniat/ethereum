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

CONTRACT_STORAGE_ADDRESS = "0x1e07cd38d85834fefbf3a6766b4d3364b9aec477"
USER_STORAGE_ADDRESS = "0x5815d672f76ecf6ca7d249e64765452524441398"


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
    def decodeABI(tinput, sig, returnVals):
        abi = tinput[2 :]
        hash = utils.sha3(sig)[: 4].encode('hex')
        if abi[: 8] != hash:
            return None
        return decode_abi(returnVals, abi[8 :].decode('hex'))
    

##################################
# main
##################################
def main():
    #
    # create rpc interface
    #
    try:
        rpc = EthJsonRpc(RPC_HOST, RPC_PORT)
    except:
        print('unable to connect to rpc server at {}:{}'.format(RPC_HOST, RPC_PORT))
        sys.exit(-1)


    if sys.argv[1] == "contracts":
        transactionHashes, identityDocuments = rpc.call(USER_STORAGE_ADDRESS, 'getUser(address)', [0x866d9f0b315afa2dcf31be291882ae9a1965f86a], ['string','string'])
        print (transactionHashes)

    elif sys.argv[1] == "newContract":
        owner = sys.argv[2]
        partner = sys.argv[3]
        text = sys.argv[4]

        tx = rpc.call_with_transaction(owner, CONTRACT_STORAGE_ADDRESS,
                                       'createNewContract(string,string)', [partner, text],
                                       gas=GAS)
        print('done, transaction id: {}'.format(tx))

        transHash = format(tx)
        trans = rpc.eth_getTransactionByHash(transHash)
        res = Decoder.decodeABI(trans['input'], 'createNewContract(string,string)', ['string','string'])
        print(res)


        transHashes = transHash#rpc.call(USER_STORAGE_ADDRESS, 'getUserTransactions(address)', [owner], ['string'])
        #transHashes += "," + transHash;

        tx = rpc.call_with_transaction(owner, USER_STORAGE_ADDRESS,
                                       'setUserTransactions(string)', [transHashes],
                                       gas=GAS)

        trans = rpc.eth_getTransactionByHash(format(tx))
        res = Decoder.decodeABI(trans['input'], 'setUserTransactions(string)', ['string'])
        print(res)


        transHashes = transHash#rpc.call(USER_STORAGE_ADDRESS, 'getUserTransactions(address)', [partner], ['string'])
        #transHashes += "," + transHash;

        tx = rpc.call_with_transaction(partner, USER_STORAGE_ADDRESS,
                                       'setUserTransactions(string)', [transHashes],
                                       gas=GAS)


        print('done, transaction id: {}'.format(tx))

        trans = rpc.eth_getTransactionByHash(format(tx))
        res = Decoder.decodeABI(trans['input'], 'setUserTransactions(string)', ['string'])
        print(res)


    owner = "0x866d9f0b315afa2dcf31be291882ae9a1965f86a"
    partner = "0x115908c9272fc6b915286de90e25a24862d69988"

    
    # while False:
    #     #
    #     # simply read input
    #     #
    #     sys.stdout.write('>> ')
    #     command = sys.stdin.readline()
        
    #     #
    #     # quit?
    #     #
    #     if 'q' in command:
    #         sys.exit(0)
       
    #     #
    #     # call function
    #     #
    #     elif 'newContract' in command:
    #         sys.stdout.write('text: ')
    #         text = sys.stdin.readline().strip()

    #         print('-' * 80)
    #         print('sending...')
    #         tx = rpc.call_with_transaction(owner, CONTRACT_STORAGE_ADDRESS,
    #                                        'createNewContract(string,string)', [partner, text],
    #                                        gas=GAS)
    #         print('done, transaction id: {}'.format(tx))

    #         transHash = format(tx)
    #         trans = rpc.eth_getTransactionByHash(transHash)
    #         res = Decoder.decodeABI(trans['input'], 'createNewContract(string,string)', ['string','string'])
    #         print(res)


    #         transHashes = transHash#rpc.call(USER_STORAGE_ADDRESS, 'getUserTransactions(address)', [owner], ['string'])
    #         #transHashes += "," + transHash;

    #         tx = rpc.call_with_transaction(owner, USER_STORAGE_ADDRESS,
    #                                        'setUserTransactions(string)', [transHashes],
    #                                        gas=GAS)

    #         trans = rpc.eth_getTransactionByHash(format(tx))
    #         res = Decoder.decodeABI(trans['input'], 'setUserTransactions(string)', ['string'])
    #         print(res)


    #         transHashes = transHash#rpc.call(USER_STORAGE_ADDRESS, 'getUserTransactions(address)', [partner], ['string'])
    #         #transHashes += "," + transHash;

    #         tx = rpc.call_with_transaction(partner, USER_STORAGE_ADDRESS,
    #                                        'setUserTransactions(string)', [transHashes],
    #                                        gas=GAS)


    #         print('done, transaction id: {}'.format(tx))

    #         trans = rpc.eth_getTransactionByHash(format(tx))
    #         res = Decoder.decodeABI(trans['input'], 'setUserTransactions(string)', ['string'])
    #         print(res)

    #     #
    #     # compose new message
    #     #
    #     elif 'newUser' in command:
    #         sys.stdout.write('address: ')
    #         address = sys.stdin.readline().strip()
    #         sys.stdout.write('identityDocs: ')
    #         docs = sys.stdin.readline().strip()
    #         print('-' * 80)W
    #         print('sending...')
    #         tx = rpc.call_with_transaction(address, USER_STORAGE_ADDRESS,
    #                                        'setUserIdentityDocs(string)', [docs],
    #                                        gas=GAS)
    #         print('done, transaction id: {}'.format(tx))

    #         trans = rpc.eth_getTransactionByHash(format(tx))
    #         res = Decoder.decodeABI(trans['input'], 'setUserIdentityDocs(string)', ['string'])
    #         print(res)

    #     #
    #     # compose new message
    #     #
    #     elif 'userData' in command:
            

    #     #
    #     # default response
    #     #
    #     else:
    #         print('command not recognized')


##################################
# run
##################################
if __name__ == '__main__':
    main()
