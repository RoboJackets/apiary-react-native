//
//  BuzzCardReader.swift
//  reactnativetest
//
//  Created by James Vogt on 7/13/25.
//

import CoreNFC
import Foundation
import React

@objc(BuzzCardReader)
class BuzzCardReader: NSObject, NFCTagReaderSessionDelegate {
  let getVersion = Data([0x60])
  static let selectGtidAppCmd = Data([0x90, 0x5A, 0x00, 0x00, 0x03, 0xCD, 0xBB, 0xBB, 0x00])
  static let readGtidFileCmd = Data([0x90, 0xbd, 0x00, 0x00, 0x07, 0x01, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00])
  
  var jsCallback: RCTResponseSenderBlock?
  
  var selectedApp: Data?
  var selectedCmd: Data?
  var session: NFCTagReaderSession?
  
  @objc
  func sendCommand(_ app: [NSNumber], cmd: [NSNumber], jsCallback: @escaping RCTResponseSenderBlock) {
    self.selectedApp = nsNumberArrayToData(app)
    self.selectedCmd = nsNumberArrayToData(cmd)
    self.jsCallback = jsCallback
    beginScanning()
  }
  
  @objc
  func readGtid(_ jsCallback: @escaping RCTResponseSenderBlock) {
    self.selectedApp = BuzzCardReader.selectGtidAppCmd
    self.selectedCmd = BuzzCardReader.readGtidFileCmd
    self.jsCallback = jsCallback
    beginScanning()
  }
  
  func tagReaderSessionDidBecomeActive(_ session: NFCTagReaderSession) {
    
  }
  
  func tagReaderSession(_ session: NFCTagReaderSession, didInvalidateWithError error: any Error) {
    
  }
  
  func sendReadTagCommand(_ data: Data, to tag: NFCMiFareTag, _ completionHandler: @escaping (Data) -> Void) {
    
    if #available(iOS 14, *) {
      tag.sendMiFareCommand(commandPacket: data) { (result: Result<Data, Error>) in
        switch result {
        case .success(let response):
          completionHandler(response)
        case .failure(let error):
          self.session?.invalidate(errorMessage: "Read tag error: \(error.localizedDescription). Please try again.")
        }
      }
    } else {
      tag.sendMiFareCommand(commandPacket: data) { (response: Data, optionalError: Error?) in
        guard let error = optionalError else {
          completionHandler(response)
          return
        }
        
        self.session?.invalidate(errorMessage: "Read tag error: \(error.localizedDescription). Please try again.")
      }
    }
  }
  
  func runCommand(tag: NFCTag) {
    guard case let .miFare(mifareTag) = tag else {
      self.session?.invalidate(errorMessage: "Invalid tag format, MiFare required.")
      return
    }
    self.sendReadTagCommand(selectedApp!, to: mifareTag) {(responseFromSelect: Data) in }
    self.sendReadTagCommand(selectedCmd!, to: mifareTag) {(responseFromCommand: Data) in
      var responseContent = responseFromCommand.prefix(responseFromCommand.count - 2)
      responseContent.append(0x00)
      let responseCode = responseFromCommand.suffix(2)
      if (responseCode == Data([0x90, 0x00]) || responseCode == Data([0x91, 0x00])),
      let _ = String(data: responseContent, encoding: .ascii) {
        self.session?.invalidate()
        self.jsCallback!([NSNull(), self.dataToNSNumberArray(responseFromCommand)])
      } else {
        self.session?.invalidate(errorMessage: "Error decoding BuzzCard output to string.")
        self.jsCallback!([responseFromCommand, NSNull()])
      }
    }
  }
  
  func beginScanning() {
    session = NFCTagReaderSession(pollingOption: [.iso14443], delegate: self, queue: nil)
    session?.alertMessage = "Hold your iPhone near the BuzzCard."
    session?.begin()
  }
  
  func tagReaderSession(_ session: NFCTagReaderSession, didDetect tags: [NFCTag]) {
    var tag: NFCTag? = nil
    
    guard let tag = tags.first else {
      session.invalidate(errorMessage: "No tags found.")
      return
    }
    
    session.connect(to: tag) { error in
      if let error = error {
        session.invalidate(errorMessage: "Error connecting to card: \(error.localizedDescription)")
        return
      }
      self.runCommand(tag: tag)
    }
  }
  
  func nsNumberArrayToData(_ numbers: [NSNumber]) -> Data {
      let bytes = numbers.map { UInt8(truncating: $0) }
      return Data(bytes)
  }
  
  func dataToNSNumberArray(_ data: Data) -> [NSNumber] {
      return data.map { NSNumber(value: $0) }
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
