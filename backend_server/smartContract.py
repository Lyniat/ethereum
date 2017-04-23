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

CONTRACT_STORAGE_ADDRESS = "0x31033b6fdee1e1ea9545aac3347eb504f6167ad2"
USER_STORAGE_ADDRESS = "0x2bdf5f4d0a23c14251a6113a842f8a24baae26f5"

counter = 0

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

    method = sys.argv[1]

    if method == "newContract":
        owner = sys.argv[2]
        partner = sys.argv[3]
        text = sys.argv[4]

        tx = rpc.call_with_transaction(owner, CONTRACT_STORAGE_ADDRESS,
                                       'createNewContract(string,string)', [partner, text],
                                       gas=GAS)
        print(format(tx))


    elif method == "contractData":
        trans_addr = sys.argv[2]
        trans = rpc.eth_getTransactionByHash(trans_addr)
        res = Decoder.decodeABI(trans['input'], 'createNewContract(string,string)', ['string','string'])
        print(res)


    elif method == "newUser":
        address = sys.argv[2]
        dataString = sys.argv[3]

        tx = rpc.call_with_transaction(address, USER_STORAGE_ADDRESS,
                                       'setUserIdentityDocs(string)', [dataString],
                                       gas=GAS)

    elif method == "identification":
        account_addr = sys.argv[2]
        transactionHashes, identityDocuments = rpc.call(USER_STORAGE_ADDRESS, 'getUser(address)', [account_addr], ['string','string'])
        print (identityDocuments)

    elif method == "accounts":
        account_id = sys.argv[2]
        print(rpc.eth_accounts()[int(account_id)])

    else:
        print("method not recognized!")


##################################
# run
##################################
if __name__ == '__main__':
    main()
